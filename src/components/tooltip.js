import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

const TooltipWrapper = (props) => (
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{props.children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="tooltip-content" sideOffset={5}>
          <span className="p-1 text-xs font-medium">{props.tooltipTitle}</span>
          <Tooltip.Arrow className="tooltip-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export default TooltipWrapper;
