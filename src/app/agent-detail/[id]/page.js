import React from "react";
import AgentList from "../../community/priv";
import prisma from "../../../utils/prisma";
const Page = async ({ params }) => {
  const { id } = params; // 'id' is extracted from the URL params
  const agentBusinessInfo = await prisma.agentBusinessinfo.findUnique({
    where: { id: parseInt(id) },
    select: { userauthId: true },
  });

  // Check if agentBusinessInfo exists
  if (!agentBusinessInfo) {
    return <div>agent not found</div>;
  }

  const { userauthId } = agentBusinessInfo;
  return (
    <div>
      <AgentList agentId={id} userauthId={userauthId} />
    </div>
  );
};

export default Page;
