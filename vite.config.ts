import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack';
import { execSync } from 'child_process';
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'
import getGitVersion from './automation/git-version';

const CheckerConfig = {
  terminal: true,
  overlay: true
}

export default defineConfig({
  base: './',
  root: 'src',
  plugins: [
    tsconfigPaths(),
    getGitVersion(),
    checker({
      typescript: true,
      ...CheckerConfig
    }),
    {
      name: 'neu-build',
      apply: 'build',
      closeBundle() {
        console.log('Building standalone app')
        execSync('neu build --release');
      }
    },
    zip({
      inDir: './dist/unpacked',
      outDir: './dist',
      outFileName: 'game-web.zip'
    })
  ],
  build: {
    outDir: '../dist/unpacked',
    chunkSizeWarningLimit: 4096,
    assetsInlineLimit: 0,
    target: 'ES2022'
  },
  server: {
    host: '127.0.0.1'
  }
});
