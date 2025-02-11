class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // Fetch both user info and initial cards
  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  // Fetch initial cards
  getInitialCards() {
    return this._fetch("/cards");
  }

  // Fetch user info
  getUserInfo() {
    return this._fetch("/users/me");
  }

  // Edit user info
  editUserInfo({ name, about }) {
    return this._fetch("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  // Update user avatar
  updateUserAvatar({ avatar }) {
    return this._fetch("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    });
  }

  // Add like to a card
  addLike(cardId) {
    return this._fetch(`/cards/${cardId}/likes`, {
      method: "PUT",
    });
  }

  // Remove like from a card
  removeLike(cardId) {
    return this._fetch(`/cards/${cardId}/likes`, {
      method: "DELETE",
    });
  }

  // Remove card
  removeCard(cardId) {
    return this._fetch(`/cards/${cardId}`, {
      method: "DELETE",
    });
  }

  // General fetch method
  _fetch(endpoint, options = {}) {
    return fetch(`${this._baseUrl}${endpoint}`, {
      headers: this._headers,
      ...options,
    })
      .then(this._handleResponse)
      .catch((err) => {
        console.error(`API request failed: ${err}`);
        throw err;
      });
  }

  // Handle API response
  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(new Error(`Error: ${res.status}`));
  }
}

export default Api;
