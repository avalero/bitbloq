import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState
} from "react";
import { DndProvider, useDrop } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import styled from "@emotion/styled";
import { Icon } from "@bitbloq/ui";

export interface ArrowProps {
  direction: "decrement" | "increment";
  disabled: boolean;
  page: number;
  onClick: (page: number) => void;
}

const Arrow: React.FC<ArrowProps> = ({
  direction,
  disabled,
  page,
  onClick
}) => {
  const [changePage, setChangePage] = useState(true);
  const [{ isOver }, drop] = useDrop({
    accept: ["document", "folder"],
    drop: item => {
      console.log(item);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    }),
    hover: () => {
      if (!disabled && changePage) {
        setChangePage(false);
        onClick(direction === "decrement" ? page - 1 : page + 1);
        setTimeout(setChangePage, 500, true);
      }
    }
  });

  return (
    <PageItem
      isOver={isOver}
      ref={drop}
      onClick={e =>
        disabled
          ? e.stopPropagation()
          : onClick(direction === "decrement" ? page - 1 : page + 1)
      }
    >
      <AngleIcon direction={direction} name="angle" />
    </PageItem>
  );
};

export interface PageProps {
  page: number;
  onClick: (page: number) => void;
  selected: boolean;
}

const Page: React.FC<PageProps> = ({ page, selected, onClick }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ["document", "folder"],
    drop: item => {
      console.log(item);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    }),
    hover: () => onClick(page)
  });

  return (
    <PageItem
      onClick={() => onClick(page)}
      selected={selected}
      ref={drop}
      isOver={isOver}
    >
      {page}
    </PageItem>
  );
};

export interface PaginatorProps {
  className?: string;
  currentPage: number;
  pages: number;
  selectPage: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  className,
  currentPage,
  pages,
  selectPage
}) => {
  let pagesElements: JSX.Element[] = [];

  for (let i = 1; i <= pages; i++) {
    pagesElements.push(
      <Page
        key={i}
        page={i}
        selected={currentPage === i}
        onClick={selectPage}
      />
    );
  }

  if (pages > 9 && currentPage < pages / 2) {
    pagesElements = [
      ...pagesElements.slice(0, 8),
      <Ellipsis key="ellipsis">
        <Icon name="ellipsis" />
      </Ellipsis>,
      pagesElements[pagesElements.length - 1]
    ];
  } else if (pages > 9 && currentPage >= pages / 2) {
    pagesElements = [
      pagesElements[0],
      <Ellipsis key="ellipsis">
        <Icon name="ellipsis" />
      </Ellipsis>,
      ...pagesElements.slice(pagesElements.length - 8, pagesElements.length)
    ];
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <PagesBar className={className}>
        <Arrow
          direction="decrement"
          disabled={currentPage === 1}
          page={currentPage}
          onClick={selectPage}
        />
        {pagesElements}
        <Arrow
          direction="increment"
          disabled={currentPage === pages}
          page={currentPage}
          onClick={selectPage}
        />
      </PagesBar>
    </DndProvider>
  );
};

export default Paginator;

interface AngleIconProps {
  direction: "decrement" | "increment";
}
const AngleIcon = styled(Icon)<AngleIconProps>`
  height: 12px;
  transform: rotate(
    ${(props: AngleIconProps) =>
      props.direction === "decrement" ? "90" : "-90"}deg
  );
  width: 12px;
`;

const Ellipsis = styled.div`
  align-items: flex-end;
  display: flex;
  height: 25px;
  margin-right: 10px;
  width: 10px;

  svg {
    width: 10px;
  }
`;

interface PageItemProps {
  isOver?: boolean;
  selected?: boolean;
}
const PageItem = styled.div<PageItemProps>`
  align-items: center;
  background-color: ${props => (props.selected ? "#eee" : "#fff")};
  border: solid 1px ${props => (props.isOver ? "#373b44" : "#ccc")};
  border-radius: 4px;
  color: #373b44;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  height: 32px;
  justify-content: center;
  margin-right: 10px;
  width: 32px;

  &:hover {
    background-color: #eee;
  }

  &:last-of-type {
    margin: 0;
  }
`;

const PagesBar = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;
