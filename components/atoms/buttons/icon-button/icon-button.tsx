import React from "react";

type IconButtonProps = {
  onClick: () => void;
  tooltip: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  loading?: boolean;
};

const IconButton: React.FC<Readonly<IconButtonProps>> = ({
  onClick,
  tooltip,
  icon: Icon,
  loading,
}) => {
  return (
    <div className="tooltip" data-tip={tooltip}>
      <button className="btn btn-ghost btn-sm px-2" onClick={onClick}>
        {!loading && <Icon className="w-7 h-7" />}
        {loading && <div className="loading loading-spinner loading-sm"></div>}
      </button>
    </div>
  );
};

export default IconButton;
