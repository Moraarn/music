// import { NextApiRequest, NextApiResponse } from "next";
// //@ts-nocheck
// import * as OSC from "osc";

// // Create a new OSC client
// const oscClient = new OSC.Client("127.0.0.1", 4560); // Sonic Pi runs on localhost:4559

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { note, velocity } = req.body;

//     // Validate input
//     if (!note || typeof note !== "number" || !velocity || typeof velocity !== "number") {
//       return res.status(400).json({ message: "Invalid input" });
//     }

//     // Send the OSC message to Sonic Pi
//     oscClient.send("/play_note", note, velocity, (err: any) => {
//       if (err) {
//         console.error("Error sending OSC message:", err);
//         return res.status(500).json({ message: "Failed to send OSC message" });
//       }
//       res.status(200).json({ message: `Note ${note} played with velocity ${velocity}` });
//     });
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).json({ message: "Method not allowed" });
//   }
// }
