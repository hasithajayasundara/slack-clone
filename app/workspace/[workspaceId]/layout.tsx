'use client';

import { ReactNode } from "react";
import { Toolbar } from "./toolbar";

type Props = {
  children: ReactNode;
};

const WorkspaceLayout = ({children}:Props)=>{
  return (
  <div className="h-ful">
    <Toolbar/>
    Layout work
    {children}
  </div>
  )
};

export default WorkspaceLayout;
