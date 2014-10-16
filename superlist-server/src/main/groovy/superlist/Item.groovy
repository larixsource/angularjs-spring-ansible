package superlist

import org.springframework.data.annotation.Id

class Item {
  @Id
  String id
  String name
}