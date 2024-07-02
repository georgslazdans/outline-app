// ** adapted from next-pwa index.js since it doesn't set up its own entries when additionalManifestEntries is specified
const path = require('path')
const fs = require('fs')
const globby = require('globby')
const crypto = require('crypto')

const getRevision = file => crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex')

// precache files in public folder
function getStaticPrecacheEntries(pwaOptions){
  // set up properties used in next-pwa code to precache the public folder
  const basePath = pwaOptions?.basePath || '/'
  const sw = pwaOptions?.sw || 'sw.js'
  const publicExcludes = pwaOptions?.publicExcludes || ['!noprecache/**/*']

  let manifestEntries = globby
  .sync(
    [
      '**/*',
      '!workbox-*.js',
      '!workbox-*.js.map',
      '!worker-*.js',
      '!worker-*.js.map',
      '!fallback-*.js',
      '!fallback-*.js.map',
      `!${sw.replace(/^\/+/, '')}`,
      `!${sw.replace(/^\/+/, '')}.map`,
      ...publicExcludes
    ],
    {
      cwd: 'public'
    }
  )
  .map(f => ({
    url: path.posix.join(basePath, `/${f}`),
    revision: getRevision(`public/${f}`)
  }))
  return manifestEntries
}

module.exports = getStaticPrecacheEntries