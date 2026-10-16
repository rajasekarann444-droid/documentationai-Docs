(function () {
  "use strict";

  var SITE_NAME = "Stakflo";
  var TAGLINE = "Compliance Automated";
  var LOGO_SELECTOR = ".dai-logo";

  function findLogoImage(logo) {
    return logo.querySelector("img");
  }

  function isIgnoredTextNode(node) {
    var parent = node.parentElement;

    if (!parent) {
      return true;
    }

    return Boolean(
      parent.closest(
        "script, style, noscript, template, .stakflo-tagline"
      )
    );
  }

  function findSiteNameNode(logo) {
    var walker = document.createTreeWalker(
      logo,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (isIgnoredTextNode(node)) {
            return NodeFilter.FILTER_REJECT;
          }

          return node.nodeValue.trim() === SITE_NAME
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    return walker.nextNode();
  }

  function getMovableNameNode(textNode, logo) {
    var parent = textNode.parentElement;

    if (
      parent &&
      parent !== logo &&
      parent.textContent.trim() === SITE_NAME &&
      !parent.querySelector("img") &&
      parent.childNodes.length === 1
    ) {
      return parent;
    }

    return textNode;
  }

  function applyLogoLayout(logo) {
    logo.style.display = "flex";
    logo.style.flexDirection = "row";
    logo.style.alignItems = "center";
  }

  function createBrandTextContainer() {
    var container = document.createElement("span");

    container.className = "stakflo-brand-text";
    container.style.display = "flex";
    container.style.flexDirection = "column";

    return container;
  }

  function createTagline() {
    var tagline = document.createElement("span");

    tagline.className = "stakflo-tagline";
    tagline.textContent = TAGLINE;

    return tagline;
  }

  function enhanceLogo(logo) {
    if (logo.querySelector(".stakflo-tagline")) {
      applyLogoLayout(logo);
      return;
    }

    if (!findLogoImage(logo)) {
      return;
    }

    var siteNameTextNode = findSiteNameNode(logo);

    if (!siteNameTextNode || !siteNameTextNode.parentNode) {
      return;
    }

    var nameNode = getMovableNameNode(siteNameTextNode, logo);
    var parent = nameNode.parentNode;

    if (!parent) {
      return;
    }

    var brandText = createBrandTextContainer();
    var tagline = createTagline();

    parent.insertBefore(brandText, nameNode);
    brandText.appendChild(nameNode);
    brandText.appendChild(tagline);

    applyLogoLayout(logo);
  }

  function enhanceLogos() {
    document.querySelectorAll(LOGO_SELECTOR).forEach(enhanceLogo);
  }

  function start() {
    enhanceLogos();

    var observer = new MutationObserver(function () {
      enhanceLogos();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    window.setInterval(enhanceLogos, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();