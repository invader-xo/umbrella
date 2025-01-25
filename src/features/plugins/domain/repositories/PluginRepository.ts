import Status from '../../../../core/shared/types/Status';
import Category from '../../data/models/item/Category';
import DetailedItem from '../../data/models/item/DetailedItem';
import Source from '../../data/models/source/Source';
import {Plugin} from '../entities/Plugin';

// Plugin repository
// This is the interface for the plugin repository
// Describes the methods that the plugin repository must implement
export interface PluginRepository {
  plugins: Plugin[];
  fetchManifest(manifestUrl: string): Promise<Status<Source>>;
  fetchPlugin(manifest: Source): Promise<Status<Plugin>>;
  getPlugins(): Plugin[];
  registerPlugin(plugin: Plugin): Promise<Status<void>>;
  deletePlugin(manifest: Source): Promise<Status<void>>;
  runPluginMethodInSandbox(
    pluginPath: string,
    methodToRun: string,
    args: any[],
  ): Promise<Status<Category | Category[] | DetailedItem | null>>;
}
