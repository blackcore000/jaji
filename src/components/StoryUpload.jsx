import React, { useState } from "react";
import StoryBar from "../components/StoryBar";
import StoryUpload from "../components/StoryUpload";
import StoryViewer from "../components/StoryViewer";

export default function StoriesPage() {
  const [openId, setOpenId] = useState(null);
  const refresh = () => setOpenId((x)=>x); // bar kendini localStorage’dan okuyor

  return (
    <div>
      <h2 style={{fontSize:24, fontWeight:800, marginBottom:12}}>Hikâyeler</h2>
      <StoryUpload afterCreate={refresh} />
      <div style={{height:12}} />
      <StoryBar onOpen={(id)=>setOpenId(id)} />
      {openId && <StoryViewer storyId={openId} onClose={()=>setOpenId(null)} />}
    </div>
  );
}
