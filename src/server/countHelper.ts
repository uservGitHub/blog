import * as AV from 'leancloud-storage';
import * as config from 'config';
import * as R from 'ramda';

// 从配置文件读取appId与appKey
AV.init(config.get('leanCloud'));

const Counter = AV.Object.extend('Counter');

/**
 * 添加历史访问量
 */
async function incrementTotal() {
  try {
    const query = new AV.Query(Counter);
    const totalData = (<any> await query.equalTo('key', 'total').find())[0];
    const total = AV.Object.createWithoutData('Counter', totalData.id);
    total.increment('time', 1);
    const data = <any> await total.save(null, { fetchWhenSave: true }); // 保存后获取最新数据
    return R.objOf('total', data.attributes.time);
  } catch(e) {
    console.log(e);
  }
}

/**
 * 添加历史访问量和文章阅读量
 */
async function incrementReading(fileKey:string) {
  try {
    const SQL = `select * from Counter where key = "total" or key = "${fileKey}" limit 10`;
    const datas = await AV.Query.doCloudQuery(SQL);
    const totalData = (<any>datas).results.find((item: any) => item.attributes.key === 'total');
    const total = AV.Object.createWithoutData('Counter', totalData.id);
    total.increment('time', 1);
    const fileData = (<any>datas).results.find((item: any) => item.attributes.key === fileKey);
    let file;
    if (fileData) {
      file = AV.Object.createWithoutData('Counter', fileData.id);
      file.increment('time', 1);
    } else {
      file = new Counter();
      file.set('key', fileKey);
      file.set('time', 1);
    }
    await AV.Object.saveAll([total, file]);
    const list = await AV.Query.doCloudQuery(SQL);
    return R.pipe(
      R.map((item: any) => R.objOf(item.attributes.key, item.attributes.time)),
      R.reduce(R.mergeDeepLeft, {})
    )((<any>list).results);
  } catch(e) {
    console.log(e);
  }
}

export { incrementTotal, incrementReading };
