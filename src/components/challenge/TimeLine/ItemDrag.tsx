import { Menu } from 'iconsax-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface IItemDragProps {
  item: {
    id: string;
    content: string;
  };
}

export default function ItemDrag({ item }: IItemDragProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='flex gap-4 h-12 bg-[#919EAB14] w-full items-center px-4 rounded-xl cursor-pointer'
    >
      <Menu size='20' color='#919EAB' />
      <div>{item.content}</div>
    </div>
  );
}
