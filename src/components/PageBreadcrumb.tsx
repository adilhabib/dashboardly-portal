
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageBreadcrumbProps {
  pageName: string;
  items?: { label: string; link: string }[];
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ pageName, items }) => {
  // If items are provided, use them, otherwise use default structure with pageName
  const breadcrumbItems = items || [
    { label: 'Dashboard', link: '/' },
    { label: pageName, link: '#' }
  ];

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.flatMap((item, index) => {
            const isLastItem = index === breadcrumbItems.length - 1;
            const elements = [
              <BreadcrumbItem key={`item-${index}`}>
                {isLastItem ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.link} className={index === 0 ? "flex items-center gap-1" : ""}>
                      {index === 0 && <Home size={16} />}
                      <span>{item.label}</span>
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ];

            if (!isLastItem) {
              elements.push(<BreadcrumbSeparator key={`sep-${index}`} />);
            }

            return elements;
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default PageBreadcrumb;
