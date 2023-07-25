import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import '../styles/login-form.css';
import DreamsList from "../components/dreams-list";

const DreamFeed: Component = () => {
  return (
    <>
      <DreamsList />
    </>
  );
}

export default DreamFeed;
