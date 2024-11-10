import Bun from 'bun';
import * as path from 'node:path';

const entrypoint = './src/index.ts';

type PackageJson = {
  readonly peerDependencies?: Record<string, unknown>;
  readonly peerDependenciesMeta?: Record<string, { readonly optional?: boolean }>;
};

const externals: string[] = ['@grpc/proto-loader', 'class-transformer/storage'];

for await (const path of new Bun.Glob('../../node_modules/**/package.json').scan(process.cwd())) {
  const { peerDependencies, peerDependenciesMeta } = (await Bun.file(path).json()) as PackageJson;

  if (peerDependencies && peerDependenciesMeta) {
    for (const dependency of Object.keys(peerDependencies)) {
      if (peerDependenciesMeta[dependency]?.optional) {
        const exists = await Bun.file(`../../node_modules/${dependency}/package.json`).exists();

        if (!exists) {
          externals.push(dependency);
        }
      }
    }
  }
}

await Bun.$`bun build --target=bun --sourcemap=inline -e ${{ raw: externals.join(' -e ') }} --outdir=${path.join(process.cwd(), 'dist')} ${path.join(process.cwd(), entrypoint)}`;
