export const playNote = async (note: number, velocity: number) => {
    const response = await fetch("/api/play-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note, velocity }),
    });
  
    const data = await response.json();
    console.log(data.message);
  };
  