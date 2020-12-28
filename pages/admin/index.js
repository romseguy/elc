import { useState, useRef } from "react";
import { AccountTypes, useSession } from "utils/useAuth";
import { observer } from "mobx-react-lite";
import { AccessDenied, Layout, Link, PageTitle } from "components";
import { Button } from "@chakra-ui/react";
import api from "utils/api";
import { format } from "date-fns";

export default observer((props) => {
  const [session = props.session] = useSession();
  const form = useRef(null);

  // const [file, setFile] = useState();
  // const inputRef = useRef();
  // const chooseFile = () => {
  //   const { current } = inputRef(current || { click: () => {} }).click();
  // };

  if (!session || session.type !== AccountTypes.ADMIN)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const exportData = async () => {
    const { error, data } = await api.get("admin/export");
    const a = document.createElement("a");
    const href = window.URL.createObjectURL(
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    a.href = href;
    a.download = "data-" + format(new Date(), "dd-MM-yyyy");
    a.click();
    window.URL.revokeObjectURL(href);
  };

  const importData = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const { error, data } = await api.post("admin/importData", formData);
    console.log(file);
    // const fileSelector = document.createElement("input");
    // fileSelector.setAttribute("type", "file");
    // fileSelector.click();
    // var file = e.target.files[0];
    // console.log(e.target);
    // console.log(file);
  };

  return (
    <Layout>
      <PageTitle>Administration</PageTitle>
      <Button onClick={exportData}>Exporter les données</Button>
      <br />
      <br />
      {/* <form
        ref={form}
        // action="/api/admin/importData"
        // method="post"
        encType="multipart/form-data"
        onSubmit={async (e) => {
          e.preventDefault();
          console.log(form.current);
          const formData = new FormData(form.current);
          const { error, data } = await api.post("admin/importData", {
            body: formData
          });
        }}
      >
        <input type="file" name="file" />
        <input type="submit" value="Importer" />
      </form> */}
      {/* <Button
        colorScheme="blue"
        onClick={() => document.getElementById("file").click()}
      >
        Importer les données
      </Button>
      <input
        type="file"
        style={{ display: "none" }}
        id="file"
        onChange={(e) => {
          importData(e);
          // var reader = new FileReader();
          // reader.onload = function (e) {
          //   console.log(typeof reader.result);
          //   annotationsObject = JSON.parse(reader.result);
          //   console.log(annotationsObject);
          //   console.log(typeof annotationsObject);
          // };
          // reader.readAsText(e.target.files[0]);
          //setFile(e.target.files);
        }}
      /> */}
    </Layout>
  );
});
