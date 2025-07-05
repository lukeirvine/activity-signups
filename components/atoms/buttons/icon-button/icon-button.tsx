import React from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type IconButtonProps = {
  onClick?: () => void;
  tooltip?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  loading?: boolean;
  tooltipPosition?: TooltipPosition;
};

const positionClasses: Record<TooltipPosition, string> = {
  top: "tooltip-top",
  bottom: "tooltip-bottom",
  left: "tooltip-left",
  right: "tooltip-right",
};

const IconButton: React.FC<Readonly<IconButtonProps>> = ({
  onClick,
  tooltip,
  icon: Icon,
  loading,
  tooltipPosition = "top",
}) => {
  return (
    <div
      className={`tooltip ${positionClasses[tooltipPosition]}`}
      data-tip={tooltip}
    >
      <button className="btn btn-ghost btn-sm px-2" onClick={onClick}>
        {!loading && <Icon className="w-7 h-7 text-base-content" />}
        {loading && <div className="loading loading-spinner loading-sm"></div>}
      </button>
    </div>
  );
};

export default IconButton;
