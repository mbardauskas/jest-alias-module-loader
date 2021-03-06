var HasteModuleLoader = require('jest-cli/src/HasteModuleLoader/HasteModuleLoader');
var util = require('util');
var assign = require('object.assign');
var path = require('path');

function JestAliasModuleLoader(config) {
  if (!config || !config.aliasedModules) throw new Error('aliasedModules not defined');
  if (!config || !config.aliasesRootDir) throw new Error('aliasesRootDir not defined');

  // a subclass of jest's HasteModuleLoader
  // allows us to alias module requires
  function CustomModuleLoader() {
    HasteModuleLoader.apply(this, arguments); // super
  }

  assign(CustomModuleLoader, HasteModuleLoader);
  util.inherits(CustomModuleLoader, HasteModuleLoader);

  // override method
  CustomModuleLoader.prototype._moduleNameToPath = function(currPath, moduleName) {
    if(moduleName in config.aliasedModules) {
      return path.join(config.aliasesRootDir, config.aliasedModules[moduleName] + ".js");
    }

    return HasteModuleLoader.prototype._moduleNameToPath.call(this, currPath, moduleName);
  };

  return CustomModuleLoader;
}

module.exports = JestAliasModuleLoader;
