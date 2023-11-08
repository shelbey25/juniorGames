
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../utils/api";


const JuniorGames = () => {
  const { data, refetch } = api.juniorGames.getAll.useQuery();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount((count + 1) % 20);
      refetch();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [count]);
  const add = api.juniorGames.addEntry.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });
  const excuse = api.juniorGames.released.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });
  const checkIfValid = (playerEvent: any, data: any) => {
    return (
      new Date().getTime() - playerEvent.timeCaught.getTime() < 7 * 60 * 1000 &&
      data.filter(
        (miniEvent: any) =>
          miniEvent.personCaught === playerEvent.killer && miniEvent.active
      ).length === 0
    );
  };
  const [killed, setKilled] = useState("");
  const [killer, setKiller] = useState("");
  if (!data) {
    return null;
  }
  return (
    <div className="min-h-screen min-w-screen h-full w-full bg-black p-4">
      <h1 className="text-white text-5xl text-center">
        Junior Games Jail System
      </h1>
      <div className="flex flex-row gap-x-8 py-16 justify-center">
        <input
          className="w-1/3 rounded-sm p-1"
          placeholder="Player Killed Full Name"
          value={killed}
          onChange={(e) => {
            setKilled(e.target.value);
          }}
        ></input>
        <input
          className="w-1/3 rounded-sm p-1"
          placeholder="Killer Full Name"
          value={killer}
          onChange={(e) => {
            setKiller(e.target.value);
          }}
        ></input>
        <button
          className="bg-green-300 rounded-sm p-1"
          onClick={() => {
            add.mutate({
              personCaught: killed,
              killer: killer,
            });
            setKilled("");
            setKiller("");
          }}
        >
          Log Event
        </button>
      </div>
      <div className={`flex p-1 rounded-sm flex-row justify-between w-full`}>
        <div className="w-1/4">
          <h1 className="text-white">Killed:</h1>
        </div>
        <div className="w-1/4">
          <h1 className="text-white">Killer:</h1>
        </div>
        <div className="w-1/4">
          <h1 className="text-white">Time:</h1>
        </div>
        <div className={`flex  w-1/5 rounded-sm `}></div>
      </div>
      <div className="flex flex-col gap-y-2">
        {data
          .filter((playerEvent) => playerEvent.active)
          .sort((a, b) =>
            checkIfValid(a, data) === checkIfValid(b, data)
              ? 0
              : checkIfValid(b, data)
              ? -1
              : 1
          )
          .map((playerEvent) => {
            return (
              <div
                className={`flex ${
                  new Date().getTime() - playerEvent.timeCaught.getTime() <
                    7 * 60 * 1000 &&
                  data.filter(
                    (miniEvent) =>
                      miniEvent.personCaught === playerEvent.killer &&
                      miniEvent.active
                  ).length === 0
                    ? "bg-red-800"
                    : "bg-green-800"
                } p-1 rounded-sm flex-row justify-between w-full`}
                key={playerEvent.id}
              >
                <div className="w-1/4">
                  <h1 className="text-white">{playerEvent.personCaught}</h1>
                </div>
                <div className="w-1/4">
                  <h1 className="text-white">{playerEvent.killer}</h1>
                </div>
                <div className="w-1/4">
                  <h1 className="text-white">
                    {playerEvent.timeCaught.toTimeString()}
                  </h1>
                </div>
                <button
                  className={`flex ${
                    new Date().getTime() - playerEvent.timeCaught.getTime() <
                      7 * 60 * 1000 &&
                    data.filter(
                      (miniEvent) =>
                        miniEvent.personCaught === playerEvent.killer &&
                        miniEvent.active
                    ).length === 0
                      ? "cursor-not-allowed"
                      : ""
                  } w-1/5 bg-white rounded-sm h-full`}
                  onClick={() => {
                    if (
                      new Date().getTime() - playerEvent.timeCaught.getTime() <
                        7 * 60 * 1000 &&
                      data.filter(
                        (miniEvent) =>
                          miniEvent.personCaught === playerEvent.killer &&
                          miniEvent.active
                      ).length === 0
                    ) {
                      return null;
                    } else {
                      excuse.mutate({ id: playerEvent.id });
                    }
                  }}
                >
                  <h1 className="text-center w-full ">Excuse</h1>
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default JuniorGames;
