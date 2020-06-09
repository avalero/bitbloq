import React, { FC, useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import JuniorButton from "./junior/Button";
import UpDownButton from "./junior/UpDownButton";
import styled from "@emotion/styled";
import colors from "../colors";

export interface IMelodyNote {
  duration: number;
  note: string;
}

export interface IMelodyEditor {
  notes: IMelodyNote[];
  onChange?: (notes: IMelodyNote[]) => void;
  noteLabels?: { [note: string]: string };
}

const allNotes = [
  "NOTE_D5",
  "NOTE_C5",
  "NOTE_B4",
  "NOTE_A4",
  "NOTE_G4",
  "NOTE_F4",
  "NOTE_E4",
  "NOTE_D4",
  "NOTE_C4"
];

const noteColors = {
  NOTE_D5: "#e10a98",
  NOTE_C5: "#790cd7",
  NOTE_B4: "#114698",
  NOTE_A4: "#0094cf",
  NOTE_G4: "#00c1c7",
  NOTE_F4: "#59b52e",
  NOTE_E4: "#d8af31",
  NOTE_D4: "#dd5b0c",
  NOTE_C4: "#ce1c23"
};

const toneDurations = ["16n", "8n", "4n", "2n", "1n"];

const durationIcons = [
  "semiquaver",
  "quaver",
  "crotchet",
  "minim",
  "semibreve"
];

const MelodyEditor: FC<IMelodyEditor> = ({ notes, onChange, noteLabels }) => {
  const [playing, setPlaying] = useState(false);
  const [noteIndex, setNoteIndex] = useState(-1);
  const [editDurationIndex, setEditDurationIndex] = useState(-1);
  const durationElementRef = useRef<HTMLDivElement | null>(null);
  const prevNoteIndex = useRef(-1);
  const toneRef = useRef<any | null>(null);
  const synthRef = useRef<any | null>(null);
  const playTimeout = useRef<number | null>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const notesWrapRef = useRef<HTMLDivElement>(null);
  const [notesWidth, setNotesWidth] = useState(0);
  const [wrapWidth, setWrapWidth] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const loadTone = async () => {
      const tone = await import("tone");
      await tone.start();
      toneRef.current = tone;
      synthRef.current = new tone.Synth().toDestination();
    };

    loadTone();

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
    };
  }, []);

  const updateWidth = () => {
    setEditDurationIndex(-1);
    if (!notesRef.current || !notesWrapRef.current) {
      return;
    }

    setNotesWidth(notesRef.current.clientWidth);
    setWrapWidth(notesWrapRef.current.clientWidth);
    setScrollPosition(
      Math.min(
        scrollPosition,
        notesRef.current.clientWidth - notesWrapRef.current.clientWidth
      )
    );
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    updateWidth();
  }, [notes]);

  const play = async () => {
    const tone = toneRef.current;
    if (!tone) {
      return;
    }
    setNoteIndex(0);
    setPlaying(true);
  };

  const stop = () => {
    setPlaying(false);
    setNoteIndex(-1);
    if (playTimeout.current) {
      window.clearTimeout(playTimeout.current);
      playTimeout.current = null;
    }
  };

  const onPlayClick = () => {
    if (playing) {
      stop();
    } else {
      play();
    }
  };

  const onScrollLeft = () => {
    setScrollPosition(Math.max(scrollPosition - 168, 0));
  };

  const onScrollRight = () => {
    setScrollPosition(Math.min(scrollPosition + 168, notesWidth - wrapWidth));
  };

  const onSetNote = (note: string, duration: number, index: number) => {
    if (onChange) {
      onChange(
        Object.assign(notes.slice(), {
          [index]: {
            note,
            duration
          }
        })
      );
    }
    if (synthRef.current && !playing && note) {
      synthRef.current.triggerAttackRelease(
        note.substring("NOTE_".length), // remove NOTE_ prefix
        toneDurations[duration]
      );
    }
  };

  useEffect(() => {
    if (!synthRef.current) {
      return;
    }

    if (!playing) {
      return;
    }

    if (noteIndex >= 0 && noteIndex < notes.length) {
      if (noteIndex !== prevNoteIndex.current) {
        const currentNote = notes[noteIndex];
        const duration = toneDurations[currentNote.duration];
        if (currentNote.note && currentNote.note.length > "NOTE_".length) {
          synthRef.current.triggerAttackRelease(
            currentNote.note.substring("NOTE_".length), // remove NOTE_ prefix
            duration
          );
        }

        playTimeout.current = window.setTimeout(() => {
          setNoteIndex(noteIndex + 1);
        }, toneRef.current.Time(duration).toSeconds() * 1000);

        if (noteIndex * 42 + 104 > wrapWidth + scrollPosition) {
          setScrollPosition(
            Math.min(noteIndex * 42 + 104 - wrapWidth, notesWidth - wrapWidth)
          );
        }
        if (noteIndex * 42 - 104 < scrollPosition) {
          setScrollPosition(Math.max(noteIndex * 42 - 104, 0));
        }
        prevNoteIndex.current = noteIndex;
      }
    } else {
      stop();
    }
  }, [notes, noteIndex, playing]);

  const showScrollLeft = scrollPosition > 0;
  const showScrollRight = notesWidth - scrollPosition > wrapWidth;

  useLayoutEffect(() => {
    if ((notes.length - 1) * 42 + 104 > wrapWidth + scrollPosition) {
      setScrollPosition(notesWidth - wrapWidth);
    }
  }, [notes.length, notesWidth, wrapWidth]);

  let durationDropdown;
  const durationElement = durationElementRef.current;
  if (editDurationIndex >= 0 && durationElement) {
    const {
      left,
      top,
      width,
      height
    } = durationElement.getBoundingClientRect();
    durationDropdown = createPortal(
      <DurationDropdown left={left + width / 2} top={top}>
        <CurrentDuration height={height}>
          <CurrentDurationCell>
            <Icon name={durationIcons[notes[editDurationIndex].duration]} />
          </CurrentDurationCell>
        </CurrentDuration>
        <DropdownRow top={height}>
          {durationIcons.map((icon, i) => (
            <Cell
              key={`duration-dropdown-${i}`}
              onClick={() =>
                onSetNote(notes[editDurationIndex].note, i, editDurationIndex)
              }
            >
              <Icon name={icon} />
            </Cell>
          ))}
        </DropdownRow>
      </DurationDropdown>,
      document.body
    );
  }

  return (
    <Container>
      <Controls>
        <PlayButton type="button" secondary onClick={onPlayClick}>
          <Icon name={playing ? "stop" : "play"} />
        </PlayButton>
        <ColumnControl>
          <ColumnBalloon>
            {notes.length}
            <Icon name="column" />
          </ColumnBalloon>
          <UpDownButton
            onUpClick={() => {
              if (onChange && notes.length < 99) {
                onChange([...notes, { duration: 2, note: "" }]);
              }
            }}
            onDownClick={() =>
              onChange && notes.length > 0 && onChange(notes.slice(0, -1))
            }
            upContent={<Icon name="plus" />}
            downContent={<Icon name="minus" />}
          />
        </ColumnControl>
      </Controls>
      <NotesLabels>
        <Row>
          <Cell first>
            <Icon name="clock" />
          </Cell>
        </Row>
        {allNotes.map(note => (
          <Row key={`label-${note}`}>
            <Cell first>{noteLabels ? noteLabels[note] : note}</Cell>
          </Row>
        ))}
      </NotesLabels>
      <NotesWrap ref={notesWrapRef}>
        <Notes ref={notesRef} scrollPosition={scrollPosition}>
          <Row>
            {notes.map((noteItem, i) => (
              <Cell
                key={`duration-${i}`}
                onClick={e => {
                  durationElementRef.current = e.currentTarget;
                  setEditDurationIndex(i);
                }}
              >
                <Icon name={durationIcons[noteItem.duration]} />
              </Cell>
            ))}
          </Row>
          {allNotes.map(note => (
            <Row key={`row-${note}`}>
              {notes.map((noteItem, i) => (
                <Cell
                  key={`note-${note}-${i}`}
                  color={
                    noteItem.note === note ? noteColors[noteItem.note] : ""
                  }
                  onClick={() =>
                    onSetNote(
                      noteItem.note === note ? "" : note,
                      noteItem.duration,
                      i
                    )
                  }
                ></Cell>
              ))}
            </Row>
          ))}
          {playing && <PlayingIndicator noteIndex={noteIndex} />}
        </Notes>
        {showScrollLeft && (
          <ScrollLeftButton>
            <JuniorButton type="button" secondary onClick={onScrollLeft}>
              <Icon name="angle" />
            </JuniorButton>
          </ScrollLeftButton>
        )}
        {showScrollRight && (
          <ScrollRightButton>
            <JuniorButton type="button" secondary onClick={onScrollRight}>
              <Icon name="angle" />
            </JuniorButton>
          </ScrollRightButton>
        )}
      </NotesWrap>
      {durationDropdown}
    </Container>
  );
};

export default MelodyEditor;

const Container = styled.div`
  background-color: ${colors.gray2};
  padding: 10px;
  display: flex;
  align-items: stretch;
  height: 100%;
  user-select: none;
  box-sizing: border-box;
  max-height: 438px;
  max-width: 100%;
  overflow: hidden;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const NotesLabels = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotesWrap = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
`;

const Notes = styled.div<{ scrollPosition: number }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  transform: translate(${props => -props.scrollPosition}px, 0);
  transition: transform 0.15s ease;
`;

const PlayButton = styled(JuniorButton)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  padding: 0px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ColumnControl = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const ColumnBalloon = styled.div`
  background-color: white;
  border-radius: 9px;
  width: 60px;
  height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;

  svg {
    width: 16px;
    height: 16px;
  }

  &::after {
    content: "";
    display: block;
    border-width: 10px 10px 0px 10px;
    border-style: solid;
    border-color: white transparent transparent transparent;
    position: absolute;
    left: 50%;
    bottom: -10px;
    transform: translate(-50%, 0px);
  }
`;

const Row = styled.div`
  display: flex;
  flex: 1;
`;

const Cell = styled.div<{ first?: boolean; color?: string }>`
  width: 40px;
  border-radius: 3px;
  background: ${props =>
    props.first ? "transparent" : props.color || "white"};
  margin: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => (props.first ? "inherit" : "pointer")};
  font-size: 14px;
  font-weight: bold;

  svg {
    width: ${props => (props.first ? 19 : 16)}px;
    height: ${props => (props.first ? 19 : 16)}px;
  }
`;

const PlayingIndicator = styled.div<{ noteIndex: number }>`
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 42px;
  left: 0px;
  background-color: rgba(255, 115, 84, 0.1);
  border: 2px solid #ff7354;
  border-radius: 5px;
  box-sizing: border-box;
  transform: translate(${props => props.noteIndex * 42}px, 0);
  transition: ${props =>
    props.noteIndex >= 0 ? "transform 0.15s ease" : "none"};
`;

const ScrollButton = styled.div`
  position: absolute;
  width: 60px;
  height: 100%;
  background-color: rgba(55, 59, 68, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;

  button {
    width: 40px;
    height: 40px;
    padding: 0px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ScrollLeftButton = styled(ScrollButton)`
  left: 0px;
  svg {
    transform: rotate(90deg);
  }
`;

const ScrollRightButton = styled(ScrollButton)`
  right: 0px;
  svg {
    transform: rotate(-90deg);
  }
`;

const DurationDropdown = styled.div<{ top: number; left: number }>`
  position: absolute;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));
  top: ${props => props.top}px;
  left: ${props => props.left}px;
`;

const CurrentDuration = styled.div<{ height: number }>`
  background-color: #eeeeee;
  transform: translateX(-50%);
  position: absolute;
  left: 50%;
  height: ${props => props.height}px;
  top: -5px;
  display: flex;
  padding: 4px 4px 1px 4px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  margin-top: 1px;
`;

const CurrentDurationCell = styled(Cell)`
  background-color: #c0c3c9;
`;

const DropdownRow = styled(Row)<{ top: number }>`
  height: 40px;
  padding: 6px;
  background-color: #eeeeee;
  border-radius: 4px;
  position: absolute;
  top: ${props => props.top}px;
  transform: translateX(-50%);
`;
