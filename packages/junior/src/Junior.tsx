import React, { useState, useEffect, useRef } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { Document, Icon, LoadingBarOverlay, useTranslate } from "@bitbloq/ui";
import {
  HorizontalBloqEditor,
  HardwareDesigner,
  bloqs2code,
  getBoardDefinition,
  Web2Board,
  IBloq,
  IBloqType,
  IBloqTypeGroup,
  IBoard,
  getComponentDefinition,
  IComponent,
  IHardware,
  BloqCategory,
  isBloqSelectComponentParameter
} from "@bitbloq/bloqs";

export interface JuniorProps {
  brandColor: string;
  title: string;
  onEditTitle: () => any;
  tabIndex: number;
  onTabChange: (tabIndex: number) => any;
  bloqTypes: IBloqType[];
  initialContent?: any;
  onContentChange: (content: any) => any;
  boards: IBoard[];
  components: IComponent[];
}

const Junior: React.FunctionComponent<JuniorProps> = ({
  children,
  brandColor,
  title,
  onEditTitle,
  tabIndex,
  onTabChange,
  bloqTypes,
  initialContent,
  onContentChange,
  boards,
  components,
  backCallback
}) => {
  const t = useTranslate();

  const [content, setContent] = useState(initialContent);
  const program = content.program || [];
  const hardware: IHardware = content.hardware || {
    board: "zumjunior",
    components: []
  };

  const board: IBoard = getBoardDefinition(boards, hardware);
  if (hardware.components.length === 0) {
    // Add board integrated components to hardware list
    if (board && board.integrated) {
      board.integrated.forEach(integratedComponent =>
        hardware.components.push({ ...integratedComponent, integrated: true })
      );
    }
  }

  const web2BoardRef = useRef<Web2Board>();
  useEffect(() => {
    web2BoardRef.current = new Web2Board("wss://web2board.es:9867/bitbloq");
  }, []);

  const componentMapRef = useRef<{ [key: string]: IComponent }>();
  useEffect(() => {
    componentMapRef.current = components.reduce((map, c) => {
      map[c.name] = c;
      return map;
    }, {});
  }, [components]);

  if (!board.integrated) {
    board.integrated = [];
  }

  // If componentMap is not set, add at least integrated componentes definition
  const componentMap = componentMapRef.current || {
    ...board.integrated.reduce((map, c) => {
      map[c.component] = getComponentDefinition(components, c.component);
      return map;
    }, {})
  };

  const getComponents = (types: string[]) =>
    hardware.components.filter(c =>
      types.some(name =>
        isInstanceOf(componentMap[c.component], name, componentMap)
      )
    );

  const getBloqPort = (bloq: IBloq): string | undefined => {
    if (!bloq) {
      return;
    }

    const bloqType = bloqTypes.find(type => type.name === bloq.type);

    if (bloqType) {
      const componentParameter =
        bloqType.parameters &&
        bloqType.parameters.find(isBloqSelectComponentParameter);
      const componentName =
        componentParameter && bloq.parameters[componentParameter.name];
      const component = hardware.components.find(c => c.name === componentName);

      return component && component.port;
    }

    return;
  };

  const availableBloqs = bloqTypes.filter(
    bloq =>
      !bloq.components ||
      bloq.components.some(bloqComponent =>
        hardware.components.some(c =>
          isInstanceOf(componentMap[c.component], bloqComponent, componentMap)
        )
      )
  );

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  const upload = async (timeout: number): Promise<void> => {
    const web2Board = web2BoardRef.current;
    const code = bloqs2code(boards, components, bloqTypes, hardware, program);

    if (!web2Board.isConnected()) {
      try {
        await web2Board.waitUntilOpened();
      } catch (e) {
        console.warn(e);
      }
    }

    if (web2Board.isConnected()) {
      setIsLoading(true);
      setLoadingPercentage(0);
      // if not loaded in tiemout ms exit
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          console.error("Uploading Timeout");
        }
      }, timeout);

      try {
        const uploadGen = web2Board.upload(code, "zumjunior");

        while (true) {
          const { value: reply, done } = await uploadGen.next();
          const fn = reply.function;

          if (fn === "is_compiling") {
            setLoadingPercentage(33);
          }
          if (fn === "is_uploading") {
            setLoadingPercentage(66);
          }
          if (done) {
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        setIsLoading(false);
        return;
      }
    } else {
      console.warn("Web2Board not connected");
    }
  };

  const mainTabs = [
    <Document.Tab
      key="hardware"
      icon={<Icon name="hardware" />}
      label={t("junior.hardware")}
      backCallback={backCallback}
    >
      <HardwareDesigner
        boards={boards}
        components={components}
        hardware={hardware}
        onHardwareChange={newHardware =>
          setContent(update(content, { hardware: { $set: newHardware } }))
        }
      />
    </Document.Tab>,
    <Document.Tab
      key="software"
      icon={<Icon name="programming" />}
      label={t("junior.software")}
      backCallback={backCallback}
    >
      <HorizontalBloqEditor
        bloqs={program}
        components={components}
        getComponents={getComponents}
        getBloqPort={getBloqPort}
        bloqTypes={availableBloqs}
        onBloqsChange={(newProgram: IBloq[][]) =>
          setContent(update(content, { program: { $set: newProgram } }))
        }
        onUpload={() => upload(10000)}
        board={board}
      />
    </Document.Tab>
  ];

  return (
    <>
      <Document
        icon={<Icon name="logo-junior" />}
        brandColor={brandColor}
        title={title || t("untitled-project")}
        onEditTitle={onEditTitle}
        tabIndex={tabIndex}
        onTabChange={onTabChange}
        backCallback={backCallback}
      >
        {typeof children === "function" ? children(mainTabs) : mainTabs}
      </Document>
      <LoadingBarOverlay isOpen={isLoading} percentage={loadingPercentage} />
    </>
  );
};

export const isInstanceOf = (
  component: IComponent,
  name: string,
  componentsMap: { [key: string]: IComponent }
): boolean => {
  if (component.name === name) {
    return true;
  }

  if (component.extends) {
    const parentComponent = componentsMap[component.extends];
    if (parentComponent) {
      return isInstanceOf(parentComponent, name, componentsMap);
    }
  }

  return false;
};

export default Junior;
