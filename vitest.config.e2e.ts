import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    // Sem specs, o comando não falha (útil enquanto os testes não foram escritos).
    passWithNoTests: true,
    // Executa uma vez para aplicar as migrations no banco de teste.
    globalSetup: ["./test/global-setup.ts"],
    // Executa antes de cada arquivo de spec (carrega .env.test e expõe cleanDatabase).
    setupFiles: ["./test/setup-e2e.ts"],
    // O banco de teste é compartilhado pelos arquivos; por isso os arquivos
    // rodam EM SÉRIE, evitando que um teste corrente apague/veja dados de outro.
    fileParallelism: false,
  },
  plugins: [
    tsConfigPaths(),
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: "es6" },
    }),
  ],
});
