// db.js
// 通常将一个 Dexie 实例声明为模块。可以在此声明所需的表以及每个表的索引方式。 Dexie 实例是整个应用程序中的单例
import Dexie from 'dexie';

export const db = new Dexie('otaku');
console.log('这是indexDB')
db.version(1).stores({
  // ++自增主键 &唯一索引
  linkList: '++id, name' // 声明主键和索引。注意：与 SQL 不同，不需要指定所有属性，而只需指定索引的属性。
});
