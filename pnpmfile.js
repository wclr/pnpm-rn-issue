const allowedRootDeps = ['cuid', 'ramda', 'date-fns']

const illegalProdDeps = [
  '@charta/config',
  '@meta/ops',
  '@meta/pack',
  '@meta/watchtrick',
  '@cycler/spy',
  '@cycler/hmr',
]

const forEach = (deps, cb) => {
  Object.keys(deps || {}).forEach(cb)
}

const readPackage = (pkg) => {
  if (!pkg.name) {
    pkg.devDependencies = {
      ...pkg.devDependencies,
      ...pkg.eslintDependencies,
    }
  }

  if (!pkg.name) {
    forEach(pkg.dependencies, (dep) => {
      if (!allowedRootDeps.includes(dep)) {
        pkg.scripts = {
          ...pkg.scripts,
          hello: 'echo hello there!',
        }
        throw `Illegal dependency ${dep} in the workspace root.`
      }
    })
  }
  if (/^@(cycler|meta)/.test(pkg.name) && pkg.peerDependencies) {
    pkg.dependencies = {
      ...pkg.dependencies,
      ...pkg.peerDependencies,
    }
  }

  if (
    /^@(charta)/.test(pkg.name) &&
    !['@charta/config', '@charta/secrets'].includes(pkg.name)
  ) {
    forEach(pkg.dependencies, (dep) => {
      if (illegalProdDeps.includes(dep)) {
        throw `Illegal dependency ${dep} in ${pkg.name} package.`
      }
    })
  }

  return pkg
}

// eslint-disable-next-line no-undef
module.exports = {
  hooks: {
    readPackage,
  },
}
