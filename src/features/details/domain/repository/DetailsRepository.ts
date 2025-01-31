import DetailedItem from '../../../plugins/data/models/item/DetailedItem';
import {Plugin} from '../../../plugins/domain/entities/Plugin';

export interface DetailsRepository {
  fetchDetails: (id: string, plugin: Plugin) => Promise<DetailedItem>;
}
