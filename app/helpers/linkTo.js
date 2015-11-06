var l = require('./l');

/**
 * Handlebars helper to generate the relevant HTML attributes to bind a Storm
 * Link object to a DOM element. Note: element will still require that the
 * "clickable" class is set separately.
 * @param {Object} link A Storm Link object.
 */
module.exports = function(link) {
  var attrs = {
    'link-type': link.class,
    'uri': link.destination
  };

  // TODO Handle "segue" field

  switch (link.class) {
    case 'SmsLink':
      var smsUri = getContactLink('sms', link.recipients, link.body);

      attrs.uri = smsUri;
      attrs['link-type'] = 'UriLink';
      break;

    case 'EmailLink':
      var mailtoUri = getContactLink('mailto', link.recipients, link.body);

      attrs.uri = mailtoUri;
      attrs['link-type'] = 'UriLink';
      break;

    case 'TimerLink':
      // TODO
      throw new Error('Not yet implemented');

    case 'AppLink':
      // TODO
      throw new Error('Not yet implemented');
  }

  var components = Object.keys(attrs).map(function(key) {
    return 'data-' + key + '="' + attrs[key] + '"';
  });

  return components.join(' ');
};

/**
 * Generates a URI with the specified {@param recipients} and {@param body},
 * for the specified {@param protocol}.
 * @param {string} protocol The protocol of the URI to return. Primarily
 *     intended for 'sms' and 'mailto'. Should not contain the trailing colon.
 * @param {Array.<string>} recipients Array of recipients to send the message
 *     to.
 * @param {string} body Body of the message.
 */
function getContactLink(protocol, recipients, body) {
  var bodyStr       = encodeURIComponent(l(body)),
      recipientsStr = recipients.join(',');

  return protocol + ':' + recipientsStr + '?body=' + bodyStr;
}
