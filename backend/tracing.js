const { initTracer } = require('jaeger-client');

const config = {
    serviceName: 'rpc-service',
    sampler: { type: 'const', param: 1 }
};

const tracer = initTracer(config);

module.exports = tracer;
