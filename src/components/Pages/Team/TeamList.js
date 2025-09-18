"use client";
import { useState } from "react";
import Tabs, { Tab } from "../../Tabs/Tabs";
import Member from "../../TeamItem/Member";
export default function TeamList({data}){
  const [activeTab, setActiveTab] = useState()

  
    return (
        <div className="featured-packages team">
        <Tabs setActive={setActiveTab} activeTab={activeTab}>
          {data.map((itm) => {
            return (
              <Tab title={itm.title} key={itm.id}>
                <div className="team-list">
                  <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {itm.members
                      ?.sort(
                        (a, b) => a.position_order - b.position_order
                      )
                      .map((memberItem, idx) => {
                        return (
                          <li key={idx}>
                            <Member data={memberItem} />
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </Tab>
            );
          })}
        </Tabs>
      </div>
    )
}