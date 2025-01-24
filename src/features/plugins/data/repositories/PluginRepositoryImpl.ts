import Status from '../../../../core/shared/types/Status';
import {Plugin} from '../../domain/entities/Plugin';
import {PluginRepository} from '../../domain/repositories/PluginRepository';
import Source from '../models/source/Source';
import {PluginService} from '../sources/PluginService';

export class PluginRepositoryImpl implements PluginRepository {
  plugins: Plugin[] = [];

  async fetchManifest(manifestUrl: string): Promise<Status<Source>> {
    return PluginService.fetchManifest(manifestUrl);
  }

  async deleteManifestFile(manifest: Source): Promise<Status<void>> {
    return PluginService.deleteManifestFile(manifest);
  }

  async fetchPlugin(manifest: Source): Promise<Status<Plugin>> {
    return PluginService.fetchPlugin(manifest);
  }

  // async loadPlugin(path: string): Promise<Status<string>> {
  //   // TODO: load plugin
  //   return {status: 'success', data: ''};
  // }

  async registerPlugin(plugin: Plugin): Promise<Status<void>> {
    // if (!plugin.name || typeof plugin.initialize !== "function") {
    //   throw new Error("Invalid plugin");
    // }

    this.plugins.push(plugin);

    return {status: 'success', data: undefined};
  }

  getPlugins(): Plugin[] {
    return this.plugins;
  }
}
