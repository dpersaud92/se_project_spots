class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  getInitialCards() {
    return this._fetch("/cards");
  }

  getUserInfo() {
    return this._fetch("/users/me");
  }

  editUserInfo({ name, about }) {
    return this._fetch("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  updateUserAvatar({ avatar }) {
    return this._fetch("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    });
  }

  addCard({ name, link }) {
    return this._fetch("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  addLike(cardId) {
    return this._fetch(`/cards/${cardId}/likes`, { method: "PUT" });
  }

  removeLike(cardId) {
    return this._fetch(`/cards/${cardId}/likes`, { method: "DELETE" });
  }

  removeCard(cardId) {
    return this._fetch(`/cards/${cardId}`, { method: "DELETE" });
  }

  _fetch(endpoint, options = {}) {
    const config = {
      headers: {
        ...this._headers,
        ...(options.body && { "Content-Type": "application/json" }),
      },
      ...options,
    };

    return fetch(`${this._baseUrl}${endpoint}`, config)
      .then(this._handleResponse)
      .catch((err) => {
        console.error(`API request failed: ${err.message}`);
        throw err;
      });
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((error) => {
      throw new Error(
        error.message || `An error occurred: ${res.status} ${res.statusText}`
      );
    });
  }
}

export default Api;
