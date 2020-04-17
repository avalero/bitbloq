import fetch from "isomorphic-fetch";
import { IDocument } from "@bitbloq/api";
import { Scene, OffscreenRenderer } from "@bitbloq/lib3d";
import { boards } from "@bitbloq/junior/src/boards";
import { components } from "@bitbloq/junior/src/components";

const SNAPSHOT_WIDTH = 700;
const SNAPSHOT_HEIGHT = 430;

export const getDocumentSnapshot = (document: IDocument): Promise<Blob> => {
  switch (document.type) {
    case "3d":
      return get3DSnapshot(document);

    case "junior":
      return getJuniorSnapshot(document);

    default:
      return Promise.reject("Can't generate snapshot for this document type");
  }
};

const get3DSnapshot = async (document: IDocument) => {
  const sceneJSON = JSON.parse(document.content!);
  const scene = Scene.newFromJSON(sceneJSON);
  const renderer = new OffscreenRenderer(scene, {
    width: SNAPSHOT_WIDTH,
    height: SNAPSHOT_HEIGHT
  });
  const image = await renderer.renderImage();
  renderer.destroy();
  return image;
};

const getJuniorSnapshot = async (document: IDocument) => {
  const { hardware } = JSON.parse(document.content!);
  if (!hardware) {
    throw new Error("Hardware not found for snapshot generation");
  }

  const width = SNAPSHOT_WIDTH;
  const height = SNAPSHOT_HEIGHT;
  const topOffset = 45;

  const { board: boardName } = hardware;

  const board = boards.find(boardItem => boardItem.name === boardName);
  if (!board) {
    throw new Error("Board not found for snapshot generation");
  }

  const canvas = new OffscreenCanvas(700, 430);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Can't create canvas context");
  }

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const boardImage = await fetch(board.snapshotImage.url)
    .then(response => response.blob())
    .then(blob => createImageBitmap(blob));

  const boardWidth = board.snapshotImage.width;
  const boardHeight = board.snapshotImage.height;

  ctx.drawImage(
    boardImage,
    width / 2 - boardWidth / 2,
    height / 2 - boardHeight / 2 + topOffset,
    board.snapshotImage.width,
    board.snapshotImage.height
  );

  await Promise.all(
    board.ports.map(async port => {
      const componentInstance = hardware.components.find(
        c => c.port === port.name
      );
      if (!componentInstance) {
        return;
      }

      const component = components.find(
        c => c.name === componentInstance.component
      )!;
      if (!component || !component.snapshotImage) {
        return;
      }

      const componentImage = await fetch(component.snapshotImage.url)
        .then(response => response.blob())
        .then(blob => createImageBitmap(blob));

      const componentWidth = component.snapshotImage.width;
      const componentHeight = component.snapshotImage.height;

      const placeholderPosition = port.placeholderPosition;
      const left = width / 2 + (placeholderPosition.x * boardWidth) / 1.65;
      const top = height / 2 - (placeholderPosition.y * boardHeight) / 1.65;

      const portX = width / 2 + (port.position.x * boardWidth) / 2;
      const portY = height / 2 - (port.position.y * boardHeight) / 2;

      ctx.strokeStyle = "#bbb";
      ctx.beginPath();
      ctx.moveTo(portX, portY + topOffset);
      if (port.direction === "west" || port.direction === "east") {
        ctx.lineTo(left, portY + topOffset);
      } else {
        ctx.lineTo(portX, top + topOffset);
      }
      ctx.lineTo(left, top + topOffset);
      ctx.stroke();

      ctx.fillStyle = "#bbbbbb";
      ctx.fillRect(
        left - componentWidth / 2 - 10,
        top - componentHeight / 2 - 8 + topOffset,
        componentWidth + 20,
        componentHeight + 20
      );

      ctx.fillStyle = "#f1f1f1";
      ctx.fillRect(
        left - componentWidth / 2 - 10,
        top - componentHeight / 2 - 10 + topOffset,
        componentWidth + 20,
        componentHeight + 20
      );

      ctx.drawImage(
        componentImage,
        left - componentWidth / 2,
        top - componentHeight / 2 + topOffset,
        componentWidth,
        componentHeight
      );
    })
  );

  return canvas.convertToBlob({ type: "image/jpeg", quality: 0.95 });
};
