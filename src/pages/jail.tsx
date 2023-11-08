
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
      void refetch();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [count]);
  const [lock, setLock] = useState(true);
  const add = api.juniorGames.addEntry.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });
  const releaseAll = api.juniorGames.releaseAll.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });
  const namesArray = [
    "Om Agarwal",
    "Ethan Agne",
    "Sophia Ahmad",
    "Markus Algard",
    "Lia Altunis",
    "Nuria Alvarez-Martin",
    "Trevon Ashton",
    "Willem Bake",
    "Milo Ball",
    "Diya Bambawale",
    "Charlie Barker",
    "Carolina Barry",
    "Sophia Bateman",
    "Emerson Beatty",
    "Sawyer Beatty",
    "Tara Behbehani",
    "Ziad Ben-Gacem",
    "Gus Bhatia",
    "Leisha Bhatnagar",
    "Grace Blanton",
    "Bea Borg",
    "Lucie Boulind",
    "Remony Burlingame",
    "Catherine Burns",
    "Paula Cabal Cortina",
    "Gio Cardini",
    "Celia Carson",
    "Javier Ceria",
    "Siena Chae",
    "Nina Christodoulou",
    "Alexandra Clappier",
    "Greta Corrigan",
    "Benjamin Courbage",
    "Ari Dacy",
    "Evan Dana",
    "Nathan de Botton",
    "Sinan de Cabrol",
    "Flint Debor",
    "Dhian Dhaliwal",
    "Sophia Dibble",
    "Oskar Doepke",
    "Jack Duffy",
    "Janat Elahi",
    "Lanier Ellison",
    "Levi Ernst",
    "Leo Feldman",
    "Charlie Fennelly",
    "Alex Fernandes",
    "Ella Friel",
    "Jaden Gardiola",
    "Lily Gargour",
    "Lucie Georgeaux-Healy",
    "Xavier Goff",
    "Daniel Gooch",
    "Lev Gorelik",
    "Jemma Granite",
    "Frank Harriss",
    "Naomi Hart",
    "Edina Hasani",
    "Alice Hay-Smith",
    "Lulu Hogan",
    "Lauren Holladay",
    "Olivia Holmberg",
    "Sophia Iannazzo",
    "Uma Israni",
    "Charlie Jacome",
    "Tommy James",
    "Delia Joncic",
    "Maeve Joncic",
    "Rakan Kawash",
    "Kuzey Kaya",
    "Naz Kaya",
    "Biraj Khadka",
    "Layla Khatiblou",
    "Max Kotsen",
    "Gracie Lamberton",
    "Max Levine",
    "Steven Lewis",
    "Elena Li-Williams",
    "Hannah Lindner",
    "Maia Londono",
    "Anderson Lugert",
    "Luisa Marcotti",
    "Lauren Marshall",
    "Robby Marshall",
    "Kenzie Matthews",
    "Andre Maytorena Cuevas",
    "Anna McIsaac",
    "Noah Meegama-MacDonald",
    "Aidan Mehltretter",
    "Beatrix Menegakis",
    "Benjamin Mills-Knutsen",
    "Kyle Moore",
    "Noor Naseer",
    "Solei Neal-Brown",
    "Bassel Ojjeh",
    "Alex Okosi",
    "Daniel Olshanskiy",
    "August Ora",
    "Amalya Otero",
    "Ava Paris",
    "Aris Perrotis",
    "Andreas Ponce de León",
    "Roman Prosperi",
    "Rahil Punshi",
    "Harshiv Puri",
    "Michael Quintin",
    "Dasha Rahman",
    "Antonio Reis",
    "Ethan Rhodes",
    "Zal Rimer",
    "Olivia Rose",
    "Kanak Roy",
    "Neel Roy",
    "Eren Rumfelt",
    "Noah Sadrian",
    "Avi Sarma",
    "Nassef Sawiris",
    "Giulia Scolari",
    "Leo Shasha",
    "Shelbe Yousey",
    "Sophie Singer",
    "Annika Skorski",
    "Danny Smadi",
    "Pepe Sokoloff Cortes",
    "Maya Spector",
    "Maddie Strong",
    "Iona Sweidan",
    "Elias Tejpaul",
    "Emma Tiller",
    "Adi Tsonev",
    "Amari Victor",
    "Sherine Wright",
    "Caimi Young",
    "Anthony Zemsky"
  ];
  const excuse = api.juniorGames.released.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });
  const checkIfValid = (playerEvent: {
    id: number;
    personCaught: string;
    killer: string;
    timeCaught: Date;
    active: boolean;
}, data: {
    id: number;
    personCaught: string;
    killer: string;
    timeCaught: Date;
    active: boolean;
}[]) => {
    return (
      new Date().getTime() - playerEvent.timeCaught.getTime() < 7 * 60 * 1000 &&
      data.filter(
        (miniEvent: {
            id: number;
            personCaught: string;
            killer: string;
            timeCaught: Date;
            active: boolean;
        }) =>
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
        <div className="w-1/3 flex flex-col"><input
          className="w-full rounded-sm p-1"
          placeholder="Player Killed Full Name"
          value={killed}
          onChange={(e) => {
            setKilled(e.target.value);
          }}
        ></input>
        <h1 className={`${killed ? "text-white" : "text-black"}`}>{namesArray.filter((name) => name.toLowerCase().includes(killed.toLowerCase()))[0]}</h1></div>
        <div className="w-1/3 flex flex-col"><input
          className="w-full rounded-sm p-1"
          placeholder="Killer Full Name"
          value={killer}
          onChange={(e) => {
            setKiller(e.target.value);
          }}
        ></input>
                <h1 className={killer ? "text-white" : "text-black"}>{namesArray.filter((name) => name.toLowerCase().includes(killer.toLowerCase()))[0]}</h1></div>

        <button
          className="bg-green-300 rounded-sm p-1"
          onClick={() => {
            add.mutate({
              personCaught: namesArray.filter((name) => name.toLowerCase().includes(killed.toLowerCase()))[0] ?? "",
              killer: namesArray.filter((name) => name.toLowerCase().includes(killer.toLowerCase()))[0] ?? "",
            });
            setKilled("");
            setKiller("");
          }}
        >
          Log Event
        </button>
        <div className="flex w-[10%]"><button
                  className={`flex w-1/2 h-full bg-slate-200 rounded-l-lg  justify-center align-middle`}
                  onClick={() => {setLock(!lock)}}
                >
                  <h1 className="text-center h-full w-full text-5xl justify-center align-middle p-1">{lock ? "🔒" : "🔓"}</h1>
                </button>
                <button
                  className={`flex w-1/2 ${!lock ? "bg-green-300" : "bg-slate-300"} ${lock ? "cursor-not-allowed"
                  : ""}  rounded-r-lg h-full p-1`}
                  onClick={() => {if (!lock) {
                    releaseAll.mutate();
                  }}}
                >
                  <h1 className="text-center w-full ">Jail Break</h1>
                </button></div>
      </div>
      <div className={`flex p-1 rounded-sm flex-row justify-between w-full`}>
        <div className="w-1/4">
          <h1 className="text-white text-3xl">Prisoner:</h1>
        </div>
        <div className="w-1/4">
          <h1 className="text-white text-3xl">Eliminated By:</h1>
        </div>
        <div className="w-1/4">
          <h1 className="text-white text-3xl">Time:</h1>
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
                  <h1 className="text-white text-3xl">{playerEvent.personCaught}</h1>
                </div>
                <div className="w-1/4">
                  <h1 className="text-white text-3xl">{playerEvent.killer}</h1>
                </div>
                <div className="w-1/4">
                  <h1 className="text-white text-3xl">
                    {playerEvent.timeCaught.getHours()%12 === 0 ? 12 : playerEvent.timeCaught.getHours()%12}:{playerEvent.timeCaught.getMinutes() < 10 ? "0" + playerEvent.timeCaught.getMinutes() : playerEvent.timeCaught.getMinutes()} { playerEvent.timeCaught.getHours() >= 12 ? 'PM' : 'AM'}
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
                  <h1 className="text-center w-full text-3xl ">Excuse</h1>
                </button>
                
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default JuniorGames;
