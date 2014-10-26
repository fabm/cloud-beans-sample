package pt.ipg.cbs.entities;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.LoadResult;
import com.googlecode.objectify.ObjectifyService;

public class Dao<T> {
  static {
    ObjectifyService.register(UserSample.class);
  }

  private final Class<?> entityClass;

  public <T>Dao(Class<T> entityClass) {
    this.entityClass = entityClass;
  }

  public Key<T> save(T object) {
    return ObjectifyService.ofy().save().entity(object).now();
  }

  public void deleteEntities(T... objects) {
    ObjectifyService.ofy().delete().entities(objects).now();
  }
  public void deleteEntity(T object) {
    ObjectifyService.ofy().delete().entity(object).now();
  }

  public T load(String id){
    return (T) ObjectifyService.ofy().load().type(entityClass).id(id).now();
  }

  public Iterable<T> loadAll(){
    return (Iterable<T>) ObjectifyService.ofy().load().type(entityClass).iterable();
  }

}
