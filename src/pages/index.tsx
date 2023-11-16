
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../utils/api";


const JuniorGames = () => {
  const { data, refetch} = api.juniorGames.getAll.useQuery();
  const [count, setCount] = useState(0);
  const startTime = {hour: 21, minute: 15}

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount((count + 1) % 20);
      void refetch();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [count]);

  const getPointValue = (time: Date) => {
    const minSinceStart = (time.getHours() - startTime.hour)*60 + (time.getMinutes()-startTime.minute)
    return Math.floor(10/(1+Math.pow(Math.E, -(minSinceStart/24-2.3)))+1)
  }

  const countKillers = (killerData: {
    id: number;
    personCaught: string;
    killer: string;
    timeCaught: Date;
    active: boolean;
}[]) => {
    const newKillerData: { name: string; kills: number }[] = [];
    killerData.forEach((killer: {
      id: number;
      personCaught: string;
      killer: string;
      timeCaught: Date;
      active: boolean;
  }) => {
      let found = false;
      newKillerData.forEach((item: { name: string; kills: number }) => {
        if (item.name === killer.killer) {
          found = true;
          item.kills += getPointValue(killer.timeCaught);
        }
      });
      if (!found) {
        newKillerData.push({ name: killer.killer, kills: getPointValue(killer.timeCaught) });
      }
    });
    return newKillerData;
  };

  if (!data) {
    return null;
  }
  return (
    <div className="flex flex-col min-h-screen h-full min-w-screen w-full bg-black p-4 pb-16">
      <header><h1 className="text-white text-8xl text-center">
        Junior Games Leaderboard
      </h1>
      <div className="w-full pt-8">
        <div className="flex flex-row w-full justify-center">
          <div className="flex flex-row w-1/4">
            <h1 className="text-white text-7xl">Ranking</h1>
          </div>
          <div className="flex flex-row w-1/4 justify-end">
            <h1 className="text-white text-7xl">Points</h1>
          </div>
        </div>
        
      </div></header>
   
        {countKillers(data)
          ?.sort((a, b) => b.kills - a.kills)
          .map((killer, key) => {
            return (
              <div
                className="flex flex-row w-full justify-center pt-4"
                key={killer.name}
              >
                <div className="flex flex-row w-[40%]">
                  <h1 className="text-white text-5xl">
                    {key + 1}. {killer.name}
                  </h1>
                </div>
                <div className="flex flex-row w-[10%] justify-end">
                  <h1 className="text-white text-5xl">{killer.kills}</h1>
                </div>
              </div>
            );
          })}
    </div>
  );
};
export default JuniorGames;
