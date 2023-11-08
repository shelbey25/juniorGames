
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../utils/api";


const JuniorGames = () => {
  const { data, refetch} = api.juniorGames.getAll.useQuery();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount((count + 1) % 20);
      void refetch();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [count]);

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
          item.kills += 1;
        }
      });
      if (!found) {
        newKillerData.push({ name: killer.killer, kills: 1 });
      }
    });
    return newKillerData;
  };

  if (!data) {
    return null;
  }
  return (
    <div className="min-h-screen min-w-screen h-full w-full bg-black p-4">
      <h1 className="text-white text-5xl text-center">
        Junior Games Leaderboard
      </h1>
      <div className="w-full pt-8">
        <div className="flex flex-row w-full justify-center">
          <div className="flex flex-row w-1/5">
            <h1 className="text-white text-4xl">Ranking</h1>
          </div>
          <div className="flex flex-row w-1/5 justify-end">
            <h1 className="text-white text-4xl">Kills</h1>
          </div>
        </div>
        {countKillers(data)
          ?.sort((a, b) => b.kills - a.kills)
          .map((killer, key) => {
            return (
              <div
                className="flex flex-row w-full justify-center pt-4"
                key={killer.name}
              >
                <div className="flex flex-row w-[30%]">
                  <h1 className="text-white text-2xl">
                    {key + 1}. {killer.name}
                  </h1>
                </div>
                <div className="flex flex-row w-[10%] justify-end">
                  <h1 className="text-white text-2xl">{killer.kills}</h1>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default JuniorGames;
