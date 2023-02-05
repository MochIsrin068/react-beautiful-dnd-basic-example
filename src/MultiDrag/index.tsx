import { useEffect, useState } from "react";
import { Divider, Skeleton, Typography } from "antd";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DraggableLocation,
  DropResult,
  DroppableStateSnapshot,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

const { Title } = Typography;

interface IItem {
  id: string;
  content: string | any;
}

interface IMoveResult {
  droppable: IItem[];
  droppable2: IItem[];
}

const MultiDrag = () => {
  const [items, setItems] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);

  const getItems = (count: number, offset: number = 0): IItem[] => {
    return Array.from({ length: count }, (v, k) => k).map((k) => ({
      content: (
        <div>
          <span>{`Task ${k + offset + 1}`}</span>
          <p className="mt-1 italic text-gray-500">{`Description of Task ${
            k + offset + 1
          }`}</p>
        </div>
      ),
      id: `task-${k + offset}`,
    }));
  };

  const reorder = (
    list: IItem[],
    startIndex: number,
    endIndex: number
  ): IItem[] => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (
    source: IItem[],
    destination: IItem[],
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation
  ): IMoveResult | any => {
    const sourceClone = [...source];
    const destClone = [...destination];
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: any = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const grid: number = 8;

  const getItemStyle = (draggableStyle: any, isDragging: boolean): {} => ({
    userSelect: "none",
    padding: 2 * grid,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? "lightgreen" : "#e2e2e2",
    borderRadius: 4,
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean): {} => ({
    background: isDraggingOver ? "lightblue" : "#f4f5f7",
    padding: grid,
    width: 300,
    minHeight: 400,
    borderRadius: 4,
  });

  const getList = (id: string): IItem[] => {
    return id === "droppable" ? items : selected;
  };

  const onDragEnd = (result: DropResult): void => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      if (source.droppableId === "droppable2") {
        setSelected(items);
      } else if (source.droppableId === "droppable") {
        setItems(items);
      }
    } else {
      const resultFromMove: IMoveResult = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setItems(resultFromMove.droppable);
      setSelected(resultFromMove.droppable2);
    }
  };

  useEffect(() => {
    setItems(getItems(10, 0));
    setSelected(getItems(5, 10));
  }, []);

  if (!items) {
    return <Skeleton avatar paragraph={{ rows: 4 }} />;
  }

  return (
    <>
      <Title level={4} className="!text-white italic">
        Multi Drag
      </Title>
      <Divider className="my-4 bg-white" />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex">
          <div className="mr-8">
            <Droppable droppableId="droppable">
              {(
                provided: DroppableProvided,
                snapshot: DroppableStateSnapshot
              ) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <p className="mb-3 font-bold pb-2 border-b-2 border-gray-200">
                    Todos
                  </p>
                  {items.map((item: any, index: number) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(
                        providedDraggable: any,
                        snapshotDraggable: DraggableStateSnapshot
                      ) => (
                        <div>
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            style={getItemStyle(
                              providedDraggable.draggableProps.style,
                              snapshotDraggable.isDragging
                            )}
                          >
                            {item.content}
                          </div>
                          {providedDraggable.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <Droppable droppableId="droppable2">
            {(
              providedDroppable2: DroppableProvided,
              snapshotDroppable2: DroppableStateSnapshot
            ) => (
              <div
                ref={providedDroppable2.innerRef}
                style={getListStyle(snapshotDroppable2.isDraggingOver)}
              >
                <p className="mb-3 font-bold pb-2 border-b-2 border-gray-200">
                  Done
                </p>
                {selected.map((item: any, index: number) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(
                      providedDraggable2: any,
                      snapshotDraggable2: DraggableStateSnapshot
                    ) => (
                      <div>
                        <div
                          ref={providedDraggable2.innerRef}
                          {...providedDraggable2.draggableProps}
                          {...providedDraggable2.dragHandleProps}
                          style={getItemStyle(
                            providedDraggable2.draggableProps.style,
                            snapshotDraggable2.isDragging
                          )}
                        >
                          {item.content}
                        </div>
                        {providedDraggable2.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
                {providedDroppable2.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </>
  );
};

export default MultiDrag;
