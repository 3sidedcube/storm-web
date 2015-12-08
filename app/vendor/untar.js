var pako = require('pako');

function TarGZ(data) {
  this.data = data;
  this.files = null;
}

TarGZ.prototype.extract = function() {
  if (this.data === null) {
    return;
  }

  var tarData = pako.inflate(this.data);

  this.files = parseTarData(tarData);
};

TarGZ.fileTypes = {
  /** regular file */
  REGTYPE: 0,

  /** link */
  LNKTYPE: 1,

  /** reserved */
  SYMTYPE: 2,

  /** character special */
  CHRTYPE: 3,

  /** block special */
  BLKTYPE: 4,

  /** directory */
  DIRTYPE: 5,

  /** FIFO special */
  FIFOTYPE: 6,

  /** reserved */
  CONTTYPE: 7
};

module.exports = TarGZ;

function parseTarData(data) {
  var i     = 0,
      files = [];

  while (i <= data.length + 512) {
    var file = parseTarEntry(data, i);

    // Break out when we reach an empty block.
    if (file.size === 0 && file.name === '') {
      break;
    }

    files.push(file);
    i += Math.ceil(file.size / 512) * 512 + 512;
  }

  return files;
}

function parseTarEntry(data, offset) {
  var nameBytes = data.slice(offset, offset += 100),
      modeBytes = data.slice(offset, offset += 8),
      uidBytes = data.slice(offset, offset += 8),
      gidBytes = data.slice(offset, offset += 8),
      sizeBytes = data.slice(offset, offset += 12),
      mtimeBytes = data.slice(offset, offset += 12),
      checksumBytes = data.slice(offset, offset += 8),
      typeBytes = data.slice(offset, offset += 1),
      linkNameBytes = data.slice(offset, offset += 100),
      magicBytes = data.slice(offset, offset += 6),
      versionBytes = data.slice(offset, offset += 2),
      unameBytes = data.slice(offset, offset += 32),
      gnameBytes = data.slice(offset, offset += 32),
      devmajorBytes = data.slice(offset, offset += 8),
      devminorBytes = data.slice(offset, offset += 8),
      prefixBytes = data.slice(offset, offset + 155);

  var name   = bytesToString(nameBytes),
      prefix = bytesToString(prefixBytes);

  var file = {
    name: prefix + name,
    mode: bytesToInt(modeBytes),
    uid: bytesToInt(uidBytes),
    gid: bytesToInt(gidBytes),
    size: bytesToInt(sizeBytes),
    mtime: bytesToInt(mtimeBytes),
    checksum: bytesToString(checksumBytes),
    type: bytesToInt(typeBytes) || 0,
    linkName: bytesToString(linkNameBytes),
    magic: bytesToString(magicBytes),
    version: bytesToString(versionBytes),
    uname: bytesToString(unameBytes),
    gname: bytesToString(gnameBytes),
    devmajor: bytesToInt(devmajorBytes),
    devminor: bytesToInt(devminorBytes),
    blob: null
  };

  var fileData = data.slice(512, 512 + file.size);

  file.blob = new Blob([fileData]);

  return file;
}

function bytesToString(bytes) {
  var string = '';

  for (var i = 0; i < bytes.length; i++) {
    var char = String.fromCharCode(bytes[i]);

    if (char === '\0') {
      break;
    }

    string += char;
  }

  return string;
}

function bytesToInt(bytes) {
  var string = bytesToString(bytes);

  return parseInt(+string, 8);
}
