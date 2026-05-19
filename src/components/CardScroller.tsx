import AcademicCard from "@/components/AcademicCard";
import type { AcademicCardProps } from "@/components/AcademicCard";

interface CardScrollerProps {
  items: AcademicCardProps[];
  cardWidth?: string;
}

const CardScroller = ({ items, cardWidth = "w-72" }: CardScrollerProps) => (
  <div className="relative -mx-4 sm:mx-0">
    <div className="flex gap-4 overflow-x-auto pb-3 px-4 sm:px-0 snap-x snap-mandatory scroll-smooth [scrollbar-width:thin]">
      {items.map((item, i) => (
        <div key={i} className={`${cardWidth} shrink-0 snap-start`}>
          <AcademicCard {...item} />
        </div>
      ))}
    </div>
  </div>
);

export default CardScroller;
