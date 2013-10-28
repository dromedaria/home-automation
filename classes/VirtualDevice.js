/*** Z-Way HA Virtual Device base class ***************************************

Version: 1.0.0
-------------------------------------------------------------------------------
Author: Gregory Sitnin <sitnin@z-wave.me>
Copyright: (c) ZWave.Me, 2013

******************************************************************************/

VirtualDevice = function (id, controller) {
    this.id = id;
    this.controller = controller;
    this.deviceType = null;
    this.deviceSubType = null;
    this.metrics = {};
    this.caps = [];
    this.tags = [];
    this.widgetClass = null;
};


VirtualDevice.prototype.init = function () {
    console.log("--- VDev init("+this.id+")");

    this.metrics["title"] = this.deviceTitle();
    this.metrics["iconBase"] = this.deviceIconBase();

    this.updateFromVdevInfo();
};

VirtualDevice.prototype.deviceTitle = function () {
    return this.id;
};

VirtualDevice.prototype.deviceIconBase = function () {
    return this.metrics.iconBase = !!this.deviceSubType ? this.deviceSubType+"_"+this.deviceSubType : this.deviceType;
};

VirtualDevice.prototype.setMetricValue = function (name, value) {
    this.metrics[name] = value;
    this.controller.emit("device.metricUpdated", this.id, name, value);
};

VirtualDevice.prototype.getMetricValue = function (name) {
    return this.metrics[name];
};

VirtualDevice.prototype.performCommand = function (command) {
    return false;
};

VirtualDevice.prototype.updateFromVdevInfo = function () {
    var self = this;

    var info = this.controller.getVdevInfo(this.id);
    if (!!info) {
        Object.keys(info).forEach(function (key) {
            var value = info[key];
            if ("tags" === key && Array.isArray(value)) {
                value.forEach(function (tag) {
                    if (!in_array(self.tags, tag)) {
                        self.tags.push(tag);
                    }
                });
                self.controller.emit("device.tagsUpdated", this.id, this.tags);
            } else {
                self.setMetricValue(key, info[key]);
            }
        });
    }
};
