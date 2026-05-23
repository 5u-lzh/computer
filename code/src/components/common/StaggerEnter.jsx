import React from 'react';

export default function StaggerEnter({ children, baseDelay = 80, className = '' }) {
  return (
    <div className={`stagger-enter ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          style: {
            ...child.props.style,
            '--i': index,
          },
        });
      })}
    </div>
  );
}
