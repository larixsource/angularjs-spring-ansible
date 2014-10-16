package superlist

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource(path = 'items')
public interface ItemRepository extends MongoRepository<Item, String> {
}