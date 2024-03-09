import path from 'path'

import moduleAlias from 'module-alias'

moduleAlias.addAlias('@', path.join(process.cwd(), 'src'))

console.log('添加路径别名成功！')
