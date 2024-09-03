type Props = {
  params: {
    workspaceId: string;
  }
};

const Workspace = ({ params: { workspaceId } }: Props) => {
  return (
    <div>
      {workspaceId}
    </div>
  )
};

export default Workspace;
