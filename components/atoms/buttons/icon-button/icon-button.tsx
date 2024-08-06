import React from "react";

type IconButtonProps = {
  onClick: () => void;
  tooltip: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const IconButton: React.FC<Readonly<IconButtonProps>> = ({
  onClick,
  tooltip,
  icon: Icon,
}) => {
  return (
    <div className="tooltip" data-tip="Upload CSV">
      <button className="btn btn-ghost btn-sm px-2" onClick={onClick}>
        <Icon className="w-7 h-7" />
      </button>
    </div>
  );
};

export default IconButton;
