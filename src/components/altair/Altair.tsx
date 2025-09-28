import { useEffect, useRef, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import {
  FunctionDeclaration,
  LiveServerToolCall,
  Modality,
  Type,
} from "@google/genai";
let baseapi = "http://localhost:3000/api";


// ----------------- Function Declarations -----------------
const declaration: FunctionDeclaration = {
  name: "render_altair",
  description: "Displays an altair graph in json format.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      json_graph: {
        type: Type.STRING,
        description:
          "JSON STRING representation of the graph to render. Must be a string, not a json object",
      },
    },
    required: ["json_graph"],
  },
};

const createTransactionDecl: FunctionDeclaration = {
  name: "create_transaction",
  description: "Create a new expense or income transaction",
  parameters: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        description: "Either 'expense' or 'income'",
        enum: ["expense", "income"],
      },
      category: {
        type: Type.STRING,
        description: "The category for the transaction (e.g. Food, Salary)",
      },
      amount: {
        type: Type.NUMBER,
        description: "The amount of money spent or received",
      },
      note: {
        type: Type.STRING,
        description: "Optional note about this transaction",
      },
      date: {
        type: Type.STRING,
        description: `Date in YYYY-MM-DD, If user says 'today', assume the current date is ${getToday()}.`,
      },
    },
    required: ["type", "category", "amount", "date"],
  },
};

const updateTransactionDecl: FunctionDeclaration = {
  name: "update_transaction",
  description: "Update an existing transaction",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description: "The ID of the transaction to update",
      },
      type: { type: Type.STRING, enum: ["expense", "income"] },
      category: { type: Type.STRING },
      amount: { type: Type.NUMBER },
      note: { type: Type.STRING },
      date: { type: Type.STRING, description: "YYYY-MM-DD" },
    },
    required: ["id"],
  },
};

const deleteTransactionDecl: FunctionDeclaration = {
  name: "delete_transaction",
  description: "Delete a transaction by ID",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description: "ID of the transaction to delete",
      },
    },
    required: ["id"],
  },
};

// ----------------- Component -----------------


function getToday(): string {
  const today = new Date();
  return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

let today = getToday();

function AltairComponent() {
  const [jsonString, setJSONString] = useState<string>("");
  const { client, setConfig, setModel } = useLiveAPIContext();

  useEffect(() => {
    setModel("models/gemini-2.0-flash-exp");
    setConfig({
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
      },
      systemInstruction: {
        parts: [
          {
            text: `You are my helpful finance assistant. 
            - If I mention spending/earning money → use create_transaction. 
            - If I say update/change → call update_transaction. 
            - If I say delete/remove → call delete_transaction. 
            Always fill in missing info by asking me first.`,
          },
        ],
      },
      tools: [
        { googleSearch: {} },
        {
          functionDeclarations: [
            declaration,
            createTransactionDecl,
            updateTransactionDecl,
            deleteTransactionDecl,
          ],
        },
      ],
    });
  }, [setConfig, setModel]);

  useEffect(() => {
    const onToolCall = async (toolCall: LiveServerToolCall) => {
      if (!toolCall.functionCalls) return;

      const responses = await Promise.all(
        toolCall.functionCalls.map(async (fc) => {
          try {
            let res;
            if (fc.name === "render_altair") {
              const str = (fc.args as any).json_graph;
              setJSONString(str);
              res = { success: true };
            } else if (fc.name === "create_transaction") {
              res = await fetch(`${baseapi}/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fc.args),
              }).then((r) => r.json());
            } else if (fc.name === "update_transaction") {
              res = await fetch(
                `${baseapi}/transactions/${fc.args?.id}`,
                fc.args && {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(fc.args),
                }
              ).then((r) => r.json());
            } else if (fc.name === "delete_transaction") {
              res = await fetch(
                `${baseapi}/transactions/${fc.args?.id}`,
                fc.args && { method: "DELETE" }
              ).then((r) => r.json());
            } else {
              res = { success: false, error: "Unknown function" };
            }

            return {
              response: { output: res },
              id: fc.id,
              name: fc.name,
            };
          } catch (err: any) {
            return {
              response: { output: { success: false, error: err.message } },
              id: fc.id,
              name: fc.name,
            };
          }
        })
      );

      client.sendToolResponse({ functionResponses: responses });
    };

    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedRef.current && jsonString) {
      console.log("jsonString", jsonString);
      vegaEmbed(embedRef.current, JSON.parse(jsonString));
    }
  }, [embedRef, jsonString]);

  return <div className="vega-embed" ref={embedRef} />;
}

export const Altair = memo(AltairComponent);
