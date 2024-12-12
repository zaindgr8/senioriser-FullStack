import React from "react";
import Cpmuntydata from "../../community/Cpmuntydata";
import prisma from "../../../utils/prisma";

const Page = async ({ params }) => {
  const { id } = params; // 'id' is extracted from the URL params
  const communityBusinessInfo = await prisma.communityBusinessinfo.findUnique({
    where: { id: parseInt(id) },
    select: { userauthId: true },
  });

  // Check if communityBusinessInfo exists
  if (!communityBusinessInfo) {
    return <div>Community not found</div>;
  }

  const { userauthId } = communityBusinessInfo;

  return (
    <div>
      {/* Pass the dynamic userauthId */}
      <Cpmuntydata communityId={id} userauthId={userauthId} />
    </div>
  );
};

export default Page;
