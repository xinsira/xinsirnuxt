/**
 * 异常捕获
 * @param ctx 上下文
 * @param next
 */
export async function errorHandler (ctx, next) {
  let status:number = 200;
  let errorMsg:any;
  try {
    await next();
  } catch (err) {
    status = 500;
    errorMsg = err;
  }
  if (status === 200) {
    return;
  }
  try {
    const errorRes = {
      errorCode: 1000,
      msg: '系统发生错误，请稍后重试'
    };
    ctx.response.status = 200;
    // 参数校验的错误
    if (errorMsg.errors && errorMsg.errors.length) {
      const validatorErr = errorMsg.errors[0];
      const { constraints = {}, contexts = {} } = validatorErr;
      errorRes.errorCode = 1001;
      errorRes.msg = (Object.values(constraints)[0] as string) || 'error';
      const context = Object.values(contexts)[0];
      if (context instanceof Object) {
        Object.assign(errorRes, context);
      }
      ctx.response.body = errorRes;
      return;
    }
    // 系统异常错误
    console.log('❌ 系统发生错误', errorMsg);
    // TODO: 可以在此处添加告警处理
    ctx.response.body = errorRes;
  } catch (error) {
    console.error('❌ 抵达兜底错误', errorMsg, error);
  }
}
