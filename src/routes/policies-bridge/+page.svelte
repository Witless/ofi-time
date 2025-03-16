<script>

  import {
    PUBLIC_PRIVACY_POLICY_ES,
    PUBLIC_PRIVACY_POLICY_EN
  } from '$env/static/public';

  function navigateToEnglish() {
    window.location = PUBLIC_PRIVACY_POLICY_EN
  }

  function navigateToSpanish() {
    window.location = PUBLIC_PRIVACY_POLICY_ES
  }
</script>

<div class="page-content">
  <h1 style="color:white">Privacy Policy</h1>
  <p>Please select your preferred language</p>

  <div class="buttons">
    <button class="btn" on:click={navigateToSpanish}>
      Español
    </button>

    <button class="btn" on:click={navigateToEnglish}>
      English
    </button>
  </div>
</div>

<style>
  .page-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    text-align: center;
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
  }

  .btn {
    background-color: #2563eb;
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1.25rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
  }

  .btn:hover {
    background-color: #1d4ed8;
  }
</style>