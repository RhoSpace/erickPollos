import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductApi } from 'src/app/models/product.model';
import * as XLSX from 'xlsx';
import { ProductService } from 'src/app/services/productService/product.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})

export class AdminViewComponent implements AfterViewInit, OnInit {

  public showInput: boolean = true;
  public product: ProductApi | any = {};
  public multidimensionalReadExcel: [][] | undefined;
  public ExcelDataJson: any;

  public amountProductCtrl: FormControl = new FormControl('', [Validators.minLength(0), Validators.maxLength(5), Validators.required,
  Validators.required, Validators.pattern("^[1-9]$")]);

  public amountProductCtrl2: FormControl = new FormControl('', [Validators.minLength(0), Validators.maxLength(5), Validators.required,
    Validators.required, Validators.pattern("^[1-9]$")]);

  // Angular material table with pagination
  displayedColumns: string[] = ['Linea', 'Codigo', 'Producto', 'Precio', 'Cantidad', 'CortaFecha', '_id',];
  dataSource = new MatTableDataSource<ProductApi>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    private productService: ProductService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getAllProducts()

    // if(this.dataSource.data == undefined ){
    //   this.showInput = false;
    // }

  }

  //Buscador
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Buscar datos en api conectada a la base de datos atlas mongodb 
  getAllProducts() {
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`);
      },
      complete: () => console.info("Realizado con exito")
    })
  }

  //Convertir Excel a JSON
  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.multidimensionalReadExcel = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      //Arreglo multidimensional sin la cabecera;
      let copiaSinCabecera: [][] = this.multidimensionalReadExcel.slice(1);
      this.prepareProductsOneByOne(copiaSinCabecera);
    };
    reader.readAsBinaryString(target.files[0]);

    this.showInput = false;

  }

  //RECORRER EL ARREGLO PARA ENVIAR A LA API EL JSON
  //AL TRABAJAR EL EXCEL ORIGINAL TENDREMOS MUCHOS DATOS QUE AGREGAR, BUSCAR MEJOR OPCION

  prepareProductsOneByOne(listado: [][]) {
    listado.forEach(data => {

      data.forEach((elemento: any, indice: number) => {

        switch (indice) {
          case 0:
            this.product.Linea = elemento;
            break

          case 1:
            this.product.Codigo = elemento;
            break

          case 2:
            this.product.Producto = elemento;
            break

          case 3:
            this.product.Precio = elemento;
            break

          case 4:
            this.product.Cantidad = elemento;
            break

          case 5:
            this.product.CortaFecha = elemento;
            break
        }

      })
      this.saveProduct();
    })
    this.product = {};
  }


  // ENVIAR A LA API NODE JS CONECTADA A LA BASE DE DATOS ATLAS MONGODB
  saveProduct() {
    this.productService.registerProduct(this.product).subscribe({
      next: (res) => {
        this.product = {};
        this.ngOnInit();
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => console.info("Realizado con exito")
    })
  }

  //Generar un listado para borrar
  deleteProductsOneByOne() {
    this.dataSource.data.forEach((dataDelete) => {
      this.product = dataDelete;
      this.deleteProduct();
    })
  }

  //Borrar producto
  deleteProduct() {
    let id: any = this.product._id;
    this.productService.deleteProduct(id).subscribe({
      next: (res) => {
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => console.info("Realizado con exito")
    });
  }


  deleteProductById(id: string) {
    this.productService.deleteProduct(id).subscribe({
      next: (res) => {
        this.product = {};
        this.ngOnInit();
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => console.info("Realizado con exito")
    });
  }

  //REFRESCAR INFORMACIÓN
  refresh(): void { window.location.reload(); }

  //ACTUALIZAR DATOS ANTES DE GUARDAR JSON A EXCEL
  downloadExcel() {
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`);
      },
      complete: () => this.convertJsonToExcel()
    })

  }

  //GUARDAR JSON EN EXCEL
  convertJsonToExcel() {

    this.deleteProductsOneByOne();
    this.dataSource.data.forEach((item: ProductApi) => {
      delete item._id;
    })

    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "Productos")
    // Generate buffer
    XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

    // Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

    XLSX.writeFile(workBook, "newExcel.xlsx")

    this.dataSource.data = [];

  }

  //actualizar
  updateProductById(id: string, amount: number) {
    let productAux: ProductApi = this.dataSource.data.filter((obj) => obj._id === id)[0];
    productAux.Cantidad = amount;
    this.productService.updateProduct(productAux).subscribe({
      next: (res) => {
        this.product = {};
        this.ngOnInit();
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      }
    });
  }

  //Actualizar Corta Fecha
  updateCortaFecha(id: string, amount: number) {
    let productAux: ProductApi = this.dataSource.data.filter((obj) => obj._id === id)[0];
    productAux.CortaFecha = amount;
    this.productService.updateProduct(productAux).subscribe({
      next: (res) => {
        this.product = {};
        this.ngOnInit();
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      }
    });
  }

  doLogout() {
    this.router.navigateByUrl('login');
  }

  openModal(content: any) {
    this.modalService.open(content, { size: 'xl' },
      // { ariaLabelledBy: 'modal-basic-title' }
    ).result.then(
      (result) => {

      },
      (reason) => {
        this.ngOnInit();
      },
    );
  }


}