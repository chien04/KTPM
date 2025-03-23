
function createFilter(name, filterFn) {
  return async (input) => {
    try {
      console.log(`Bắt đầu filter: ${name}`);
      const result = await filterFn(input);
      console.log(`Hoàn thành filter: ${name}`);
      return result;
    } catch (error) {
      console.error(`Lỗi trong filter "${name}":`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Lỗi trong filter "${name}": ${errorMessage}`);
    }
  };
}

function createPipeline(...filters) {
  return async (input) => {
    console.log("Bắt đầu thực thi pipeline");
    let result = input;
    for (const filter of filters) {
      result = await filter(result);
    }
    console.log("Hoàn thành thực thi pipeline");
    return result;
  };
}

// Hàm đo hiệu năng
function withPerformanceTracking(name, filter) {
  return async (input) => {
    const startTime = performance.now();
    try {
      const result = await filter(input);
      const endTime = performance.now();
      console.log(
        `Filter "${name}" mất ${(endTime - startTime).toFixed(2)}ms để thực thi`
      );
      return {
        ...result,
        performance: {
          ...(result.performance || {}),
          [name]: endTime - startTime,
        },
      };
    } catch (error) {
      const endTime = performance.now();
      console.error(
        `Filter "${name}" thất bại sau ${(endTime - startTime).toFixed(2)}ms`
      );
      throw error;
    }
  };
}

module.exports = {
  createFilter,
  createPipeline,
  withPerformanceTracking
};