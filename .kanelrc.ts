import { Output } from "kanel";
import { makeKyselyHook } from "kanel-kysely";
import { camelCase } from "lodash-es";
import { serverEnv } from "./env/server";

const camelCaseHook = (output: Output): Output =>
  Object.fromEntries(
    Object.entries(output).map(([path, fileContents]) => [
      path,
      {
        ...fileContents,
        declarations: fileContents.declarations.map((declaration) =>
          declaration.declarationType === "interface"
            ? {
                ...declaration,
                properties: declaration.properties.map((property) => ({
                  ...property,
                  name: camelCase(property.name),
                })),
              }
            : declaration
        ),
      },
    ])
  );

// https://github.com/kristiandupont/kanel/issues/567#issuecomment-2299455152
const extractEnumValuesHook = (_path: string, lines: string[]) => {
  let l = lines.length;
  const isTableFile = lines.some((line: string) =>
    line.includes("Represents the table")
  );
  const isEnumFile = lines.some((line: string) =>
    line.includes("Represents the enum")
  );

  if (isTableFile) {
    for (let i = 0; i < l; i++) {
      const match = lines[i]!.match(/^import type { default as (.+) }/);
      if (match) {
        lines[i] = `import type { ${match[1]} } from './${match[1]}';`;
      }
    }
  }

  if (isEnumFile) {
    for (let i = 0; i < l; i++) {
      {
        const match = lines[i]!.match(/^type (.+) =/);
        if (match) {
          lines[i] = `export const ${match[1]} = [`;
          lines.push(`export type ${match[1]} = (typeof ${match[1]})[number];`);
        }
      }
      {
        const match = lines[i]!.match(/^export default/);
        if (match) {
          lines.splice(i, 1);
          l--;
        }
      }
      {
        const match = lines[i]!.match(/\| '(.+)'$/);
        if (match) {
          lines[i] = `  '${match[1]}', `;
        }
      }
      {
        const match = lines[i]!.match(/\| '(.+)';$/);
        if (match) {
          lines[i] = `  '${match[1]}',`;
          lines.splice(i + 1, 0, `] as const;`);
          l++;
        }
      }
    }
  }

  return lines;
};

// Kanel's Kysely plugin doesn't have a way to specify separate insert and update types,
// which is a problem when we've set custom types for columns. For instance, we've mapped
// the "numeric" type to "number" in our Kysely setup, but we need to use a string for
// the insert type and update types.
//
// This inelegant hook fixes that by replacing the "number" type with "string" in the
// insert and update types.
const fixNumeric = (path: string, lines: string[]) => {
  return lines.map((line) => {
    if (
      line.includes(
        "ColumnType<NumericPlaceholder, NumericPlaceholder, NumericPlaceholder>"
      )
    ) {
      return line.replace(
        "ColumnType<NumericPlaceholder, NumericPlaceholder, NumericPlaceholder>",
        "ColumnType<number, string, string>"
      );
    }
    if (
      line.includes(
        "ColumnType<NumericPlaceholder | null, NumericPlaceholder | null, NumericPlaceholder | null>"
      )
    ) {
      return line.replace(
        "ColumnType<NumericPlaceholder | null, NumericPlaceholder | null, NumericPlaceholder | null>",
        "ColumnType<number | null, string | null, string | null>"
      );
    }
    if (
      line.includes(
        "ColumnType<NumericPlaceholder, NumericPlaceholder | undefined, NumericPlaceholder>"
      )
    ) {
      return line.replace(
        "ColumnType<NumericPlaceholder, NumericPlaceholder | undefined, NumericPlaceholder>",
        "ColumnType<number, string | undefined, string>"
      );
    }

    return line;
  });
};

export default {
  connection: serverEnv.DATABASE_URL,
  preDeleteOutputFolder: true,
  outputPath: "./services/db/schemas",
  customTypeMap: {
    "pg_catalog.tsvector": "string",
    "pg_catalog.bpchar": "string",
    "pg_catalog.date": "string",
    "pg_catalog.timestamp": "string",
    "pg_catalog.timestamptz": "string",
    "pg_catalog.numeric": {
      name: "NumericPlaceholder",
      // typeImports: [
      //   {
      //     name: "BigNumber",
      //     path: "bignumber.js",
      //     isAbsolute: true,
      //     isDefault: true,
      //   },
      // ],
    },
  },
  preRenderHooks: [makeKyselyHook(), camelCaseHook],
  // Only use fixNumeric when using pg adapter; otherwise, numeric is returned as string
  postRenderHooks: [fixNumeric, extractEnumValuesHook],
};
